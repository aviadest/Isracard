import { Link } from 'react-router-dom';
import './header.scss'

function Header() {
    return (
        <header className={'header-container'}>
            <h1>Flight Board</h1>

            <nav>
                <Link to='/'>Home</Link>
                <Link to='/board'>Board</Link>
                <Link to='/search'>Search</Link>
                <Link to='/add'>Add</Link>
            </nav>
        </header>)
}

export default Header;
