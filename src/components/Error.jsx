import { Link } from "react-router-dom";

function Error(){
    return(
        <Link to={'/'}><img className="error" src="./img/error.gif" alt="" /></Link>
    )
}

export default Error;