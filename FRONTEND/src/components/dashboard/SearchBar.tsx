interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: Props) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "30px",
      }}
    >
      <input
        type="text"
        placeholder="ðŸ” Search by IP, Username or Event Type"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #374151",
          background: "#111827",
          color: "white",
          fontSize: "15px",
          outline: "none",
        }}
      />
    </div>
  );
}
