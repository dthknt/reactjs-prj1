import './styles.css';

export const TextInput = ({termoBusca, handleChangeSearch}) => {
    return (
        <input className="text-input"
        onChange={handleChangeSearch}
        type="search"
        value={termoBusca} />
    );
}