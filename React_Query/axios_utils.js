import axios from 'axios'

const client = axios.create({baseURL: 'https://bridge-api.elongoat.io/api/elongoat'})
export const apiRequest = ({...options}) => {
  const onSuccess = (response) => response
  const onError = (error) => error

  return client(options).then(onSuccess).catch(onError)
}
