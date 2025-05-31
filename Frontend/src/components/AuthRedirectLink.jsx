import { useNavigate } from "react-router-dom";

export default function AuthRedirectLink({ text, linkText, to }) {
    const navigate = useNavigate();

    return (
        <p className="mt-2 text-sm text-secondary-400">
            {text}{' '}
            <span
                className="text-secondary-200 cursor-pointer hover:underline"
                onClick={() => navigate(to)}
            >
                {linkText}
            </span>
        </p>
    )
}