import {UserProvider} from "./context/user.context.jsx"
import Router from "./function/routes/Router.jsx"

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