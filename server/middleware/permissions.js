exports.confirmOwnership = (req, res, next) => {
    if (req.user.is_admin) return next();
    if (parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) return next();
    return errorHandler(403, 'You are forbidden from performing this action.');
}