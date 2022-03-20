import {Toaster} from 'react-hot-toast'
import '../index.scss'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {Provider} from 'react-redux'
import store from '../Redux/store'

// Create a client
const queryClient = new QueryClient()

function MyApp({Component, pageProps}) {
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Toaster
            toastOptions={{
              position: 'bottom-right',
              className: 'toast_styles',
              success: {
                duration: 5000,
                border: '1px solid #A230ED',
                padding: '16px',
                color: '#A230ED',
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </>
  )
}

export default MyApp
