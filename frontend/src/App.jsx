import Router from "./function/routes/Router.jsx"
import {UserProvider} from "./context/user.context.jsx"

function App() {

  return (
    <>
    <UserProvider>
    <Router />
    </UserProvider>
    </>
  )
}

export default App