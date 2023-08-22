export const getEmptyFields = (reqBody: Object, requiredFields: string[]) => {
    let emptyFields: string[] = [];
    for (let field of requiredFields) {
        if (!reqBody.hasOwnProperty(field)) {
            emptyFields.push(field);
        }
    }
    return emptyFields;
}
