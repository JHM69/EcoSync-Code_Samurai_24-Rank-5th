
const url = process.env.API;

export const getBaseUrl = () => {
    // console.log(process.env.API);
    return process.env.API || 'http://localhost:5000';
}
 