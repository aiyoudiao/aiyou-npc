const loadingContext = {
    status: '',

    runing: null,
    ending: null,

    runingError: null,
}


exports.loadingOperator = {
    setStatus: (status) => loadingContext.status = status, 
    setRuning: (fn) => loadingContext.runing = fn, 
    setEnding: (fn) => loadingContext.ending = fn, 
    setRuningError: (fn) => loadingContext.runingError = fn,

    getStatus: () => loadingContext.status, 
    getRuning: () => loadingContext.runing, 
    getEnding: () => loadingContext.ending, 
    getRuningError: () => loadingContext.runingError, 
}