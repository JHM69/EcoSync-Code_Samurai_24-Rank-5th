
const url = process.env.API;

export const getBaseUrl = () => {
    // console.log(process.env.API);
    return process.env.API || 'http://10.33.27.140:5000';
}
 