import React from 'react'
import Login from '../components/login-page'
import Register from '../components/register-page'

const page : React.FC = () => {
    
    const [isLoginPage, setIsLoginPage] = React.useState(true);
    const toglePage = () => {
                setIsLoginPage(!isLoginPage);
    }
    if (isLoginPage) {
        return <Login toglePageFunction={toglePage} />;
    } else {
        return <Register toglePageFunction={toglePage} />;
    }
}

export default page