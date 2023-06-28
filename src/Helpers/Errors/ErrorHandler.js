class ErrorHandler {
    static handle(error, req, res) {

        if(error.code){
            return res.status(error.code).json({ status: error.code, message: error.message });
        }

        return res.status(500).json({ status: 500, error: error.message });

    }
}

export default ErrorHandler;
