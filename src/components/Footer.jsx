function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Sentiment Analysis Dashboard. All rights reserved.</p>
                    <p className="mt-1">
                        Website maintained by <span className="font-semibold text-gray-900 dark:text-white">Siddhant Maji</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
