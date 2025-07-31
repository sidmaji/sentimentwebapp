import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import Papa from 'papaparse'
import { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip)

// Helper: parse run_id for config
function parseRunId(run_id) {
    const parts = run_id.split('_')
    let use_sentiment = true
    let idx = 0
    if (parts[0] === 'baseline') {
        use_sentiment = false
        idx = 1
    }
    const window_size = String(parts[idx].replace('ws', ''))
    const scaler = parts[idx + 1].replace('scaler', '')
    const loss_fn = parts[idx + 2].replace('loss', '')
    const batch_size = String(parts[idx + 3].replace('bs', ''))
    const epochs = String(parts[idx + 4].replace('ep', ''))
    // Model name: if not present, it's "lstm"
    let model_name = parts.slice(idx + 5).join('_') || 'lstm'
    return { use_sentiment, window_size, scaler, loss_fn, batch_size, epochs, model_name }
}

// Model label mapping (user's canonical names)
const MODEL_LABELS = {
    lstm: 'LSTM',
    stacked_lstm: 'Stacked LSTM',
    gru: 'GRU',
    lstm_gru: 'LSTM+GRU',
    transformer: 'Transformer',
    cnn_lstm: 'CNN+LSTM',
    bi_lstm: 'BiLSTM',
    bilstm_attention: 'BiLSTM+Attention',
    lstm_attention: 'LSTM+Attention',
}

// Get all unique models and their available configs
function getModelConfigs(rows) {
    const configs = rows.map((row) => ({
        ...parseRunId(row.run_id),
    }))
    // Group by model_name
    const models = {}
    configs.forEach((cfg) => {
        if (!models[cfg.model_name]) models[cfg.model_name] = []
        models[cfg.model_name].push(cfg)
    })
    // For each model, get unique values for each config param
    const modelConfigs = {}
    Object.entries(models).forEach(([model, cfgs]) => {
        const uniq = (arr, key) => [...new Set(arr.map((x) => x[key]))]
        modelConfigs[model] = {
            window_size: uniq(cfgs, 'window_size'),
            scaler: uniq(cfgs, 'scaler'),
            loss_fn: uniq(cfgs, 'loss_fn'),
            batch_size: uniq(cfgs, 'batch_size'),
            epochs: uniq(cfgs, 'epochs'),
            configs: cfgs,
        }
    })
    return modelConfigs
}

// Find the closest matching config for a model given selected values
function findConfig(cfgs, selected) {
    // Try to find an exact match, else fallback to first available
    return (
        cfgs.find(
            (c) => c.window_size === selected.window_size && c.scaler === selected.scaler && c.loss_fn === selected.loss_fn && c.batch_size === selected.batch_size && c.epochs === selected.epochs
        ) || cfgs[0]
    )
}

// Filter rows for a config and sentiment flag
function filterRows(rows, config, use_sentiment) {
    return rows.filter((row) => {
        const parsed = parseRunId(row.run_id)
        return (
            parsed.use_sentiment === use_sentiment &&
            parsed.window_size === config.window_size &&
            parsed.scaler === config.scaler &&
            parsed.loss_fn === config.loss_fn &&
            parsed.batch_size === config.batch_size &&
            parsed.epochs === config.epochs &&
            parsed.model_name === config.model_name
        )
    })
}

export default function MultivariateForecasting() {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [modelConfigs, setModelConfigs] = useState({})
    // For each model, track selected config values
    const [selected, setSelected] = useState({})

    useEffect(() => {
        fetch('/preds.csv')
            .then((res) => res.text())
            .then((csv) => {
                Papa.parse(csv, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const data = results.data.map((row) => ({
                            ...row,
                            date: row.date.split(' ')[0], // remove time if present
                        }))
                        setRows(data)
                        setModelConfigs(getModelConfigs(data))
                        setLoading(false)
                    },
                })
            })
    }, [])

    // Set default selected config for each model after loading
    useEffect(() => {
        if (!loading && Object.keys(modelConfigs).length) {
            const sel = {}
            Object.entries(modelConfigs).forEach(([model, cfg]) => {
                sel[model] = {
                    window_size: cfg.window_size.includes('20') ? '20' : cfg.window_size[0],
                    scaler: cfg.scaler.includes('RobustScaler') ? 'RobustScaler' : cfg.scaler[0],
                    loss_fn: cfg.loss_fn.includes('mse') ? 'mse' : cfg.loss_fn[0],
                    batch_size: cfg.batch_size.includes('32') ? '32' : cfg.batch_size[0],
                    epochs: cfg.epochs.includes('200') ? '200' : cfg.epochs[0],
                }
            })
            setSelected(sel)
        }
        // eslint-disable-next-line
    }, [loading, modelConfigs])

    // Which model is currently selected for chart display
    const [activeModel, setActiveModel] = useState('lstm')

    // When user changes a config value for a model
    function handleConfigChange(model, key, value) {
        setSelected((prev) => ({
            ...prev,
            [model]: {
                ...prev[model],
                [key]: value,
            },
        }))
    }

    // Get chart data for the active model and its selected config
    const chartData = useMemo(() => {
        if (!rows.length || !modelConfigs[activeModel] || !selected[activeModel]) return {}
        const cfgs = modelConfigs[activeModel].configs
        const selCfg = findConfig(cfgs, { ...selected[activeModel], model_name: activeModel })
        if (!selCfg) return {}
        // Get both with and without sentiment runs for this config
        const withSentimentRows = filterRows(rows, selCfg, true)
        const withoutSentimentRows = filterRows(rows, selCfg, false)
        // Dates for x-axis: union of both runs' dates, sorted
        const allDates = [...new Set([...withSentimentRows.map((r) => r.date), ...withoutSentimentRows.map((r) => r.date)])].sort((a, b) => new Date(a) - new Date(b))
        // Map date to actual/predicted for each run
        function buildSeries(rows, key) {
            const map = {}
            rows.forEach((r) => {
                map[r.date] = r[key]
            })
            return allDates.map((d) => (map[d] !== undefined ? map[d] : null))
        }
        // Always show actual (from withSentimentRows if available, else without)
        const actualRows = withSentimentRows.length ? withSentimentRows : withoutSentimentRows
        const datasets = [
            {
                label: 'Test Actual',
                data: buildSeries(actualRows, 'actual'),
                borderColor: '#111827',
                backgroundColor: '#111827',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.1,
            },
        ]
        if (withSentimentRows.length) {
            datasets.push({
                label: 'Test Predicted (with sentiment)',
                data: buildSeries(withSentimentRows, 'predicted'),
                borderColor: '#2563eb',
                backgroundColor: '#2563eb',
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [6, 3],
                fill: false,
                tension: 0.1,
            })
        }
        if (withoutSentimentRows.length) {
            datasets.push({
                label: 'Test Predicted (no sentiment)',
                data: buildSeries(withoutSentimentRows, 'predicted'),
                borderColor: '#f59e42',
                backgroundColor: '#f59e42',
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [6, 3],
                fill: false,
                tension: 0.1,
            })
        }
        return {
            labels: allDates,
            datasets,
        }
    }, [rows, modelConfigs, selected, activeModel])

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { mode: 'index', intersect: false },
            },
            scales: {
                x: {
                    title: { display: true, text: 'Date' },
                    ticks: { maxTicksLimit: 12 },
                },
                y: {
                    title: { display: true, text: 'Price (USD)' },
                },
            },
            elements: {
                line: { borderWidth: 2 },
            },
        }),
        []
    )

    if (loading || !Object.keys(modelConfigs).length || !Object.keys(selected).length) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-700 dark:text-gray-200">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <div className="max-w-6xl mx-auto mb-6">
                <button
                    onClick={() => navigate('/')} // or navigate('/') if you want to go home
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Home</span>
                </button>
            </div>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
                <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Multivariate Time Series Forecasting</h1>
                    <div className="overflow-x-auto mb-8">
                        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="px-3 py-2 text-left">Model</th>
                                    <th className="px-3 py-2 text-left">Window Size</th>
                                    <th className="px-3 py-2 text-left">Scaler</th>
                                    <th className="px-3 py-2 text-left">Loss</th>
                                    <th className="px-3 py-2 text-left">Batch</th>
                                    <th className="px-3 py-2 text-left">Epochs</th>
                                    <th className="px-3 py-2 text-left">Show</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(modelConfigs).map(([model, cfg]) => (
                                    <tr key={model} className={activeModel === model ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}>
                                        <td className="px-3 py-2 font-semibold">{MODEL_LABELS[model] || model}</td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                                                value={selected[model]?.window_size}
                                                onChange={(e) => handleConfigChange(model, 'window_size', e.target.value)}
                                            >
                                                {cfg.window_size.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                                                value={selected[model]?.scaler}
                                                onChange={(e) => handleConfigChange(model, 'scaler', e.target.value)}
                                            >
                                                {cfg.scaler.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                                                value={selected[model]?.loss_fn}
                                                onChange={(e) => handleConfigChange(model, 'loss_fn', e.target.value)}
                                            >
                                                {cfg.loss_fn.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                                                value={selected[model]?.batch_size}
                                                onChange={(e) => handleConfigChange(model, 'batch_size', e.target.value)}
                                            >
                                                {cfg.batch_size.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                                                value={selected[model]?.epochs}
                                                onChange={(e) => handleConfigChange(model, 'epochs', e.target.value)}
                                            >
                                                {cfg.epochs.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <button
                                                className={`px-3 py-1 rounded ${activeModel === model ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                                                onClick={() => setActiveModel(model)}
                                            >
                                                Show
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-8">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Legend:</span>
                        <span className="ml-2">Black = Test Actual, Blue = Test Predicted (with sentiment), Orange dashed = Test Predicted (no sentiment)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
