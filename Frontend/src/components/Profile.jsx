export default function Profile({email, handleCategories, handleLogout}) {
    return (
        <div className="inline-block top-16 right-1 dropdown">
            <ul className="list">
                <li className="pt-2 px-2">{email}</li>
                <hr className="border-primary-300"/>
                <li className="list_item">Categories</li>
                <li className="list_item" onClick={handleLogout}>Logout</li>
            </ul>
        </div>
    )
}