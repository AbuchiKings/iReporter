
const responseHandler = {

  handleError(status, message) {
   let ex = new Error;
    ex.status =status;
    ex.message = message;
    throw ex;
  },

  handleResponse(res, status, result, message) {
    if (result instanceof Error) {
      return res.status(result.status).send(result);
    }
    return res.status(status).send({ data: [result], message })
  }
}




export default responseHandler;
