
const url = process.env.API;

export const getBaseUrl = () => {
    // console.log(process.env.API);
    return process.env.API || 'http://54.80.47.120:5000/api';
}

//'http://54.80.47.120:5000/api';