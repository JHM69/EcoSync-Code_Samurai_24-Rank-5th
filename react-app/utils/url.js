
const url = process.env.API;

export const getBaseUrl = () => {
    // console.log(process.env.API);
    return process.env.API || 'http://3.208.28.247:5000';
}
 