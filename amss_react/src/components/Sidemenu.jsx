import "../styles/Sidemenu.css";
import {useNavigate} from 'react-router-dom';

const Sidemenu = () => {
    const navigate = useNavigate();
    const items = [
        {
            id: 1,
            name: "Home",
            route: "/home"
        },
        {
            id: 2,
            name: "Profile",
            route: "/profile"
        }
    ]

    const handleNavigate = (route) => {
        navigate(route);
    }

    return (
        <>
            <div className="sidemenu-container">
                <div className="sidemenu-items">
                    {items.map((item) => (
                        <div key={item.id} className="item"
                            onClick={() => handleNavigate(item.route)}>
                            <strong>{item.name}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Sidemenu;