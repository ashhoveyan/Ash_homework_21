import fs from 'fs';


export default (schema, target) => {
    return (req, res, next) => {
        const {error} = schema.validate(req[target], { abortEarly: false });
        const fields = {};
        if (error) {

            if (req.file){
                fs.unlinkSync(req.file.path);
            }

            error.details.forEach(detail => {
                fields[detail.path[0]] = detail.message;
            });
            const hasErrors = Object.keys(fields).length > 0;

            if (hasErrors) {
                res.status(422).json({ "errors": fields,"message":"Validation Failed" });

                return fields
            }
        }
        next()
    }
}