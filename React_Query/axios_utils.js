import axios from 'axios'

const client = axios.create({baseURL: 'http://3.239.197.43:4000/api/elongoat'})

export const apiRequest = ({...options}) => {
  const onSuccess = (response) => response
  const onError = (error) => error

  return client(options).then(onSuccess).catch(onError)
}
