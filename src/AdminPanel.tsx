import type { Artwork } from "./types";

interface AdminPanelProps {
  artworks: Artwork[];
  setArtworks: React.Dispatch<React.SetStateAction<Artwork[]>>;
  onLogout: () => void;
}

export default function AdminPanel({
  artworks,
  setArtworks,
  onLogout,
}: AdminPanelProps) {
  const handleAddArtwork = (newArt: Partial<Artwork>) => {
    const art: Artwork = {
      id: Math.random().toString(36).slice(2),
      title: newArt.title || "Sin título",
      description: newArt.description || "Ilustración de alta calidad.",
      price: newArt.price || 0,
      previewUrl: newArt.previewUrl || "",
      highResUrl: newArt.highResUrl || "",
      category: newArt.category || "Varios",
      year: newArt.year || new Date().getFullYear().toString(),
      createdAt: Date.now(),
    };

    setArtworks((prev) => [art, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black">Panel Admin</h2>
        <button
          onClick={onLogout}
          className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FORM */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100">
          <h3 className="text-xl font-bold mb-8">Añadir obra</h3>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);

              handleAddArtwork({
                title: f.get("title") as string,
                price: Number(f.get("price")),
                category: f.get("category") as string,
                year: f.get("year") as string,
                previewUrl: f.get("previewUrl") as string,
                highResUrl: f.get("highResUrl") as string,
              });

              (e.target as HTMLFormElement).reset();
            }}
          >
            <input name="title" placeholder="Título" required className="w-full px-5 py-3 rounded-xl border" />
            <input name="price" type="number" step="0.01" placeholder="Precio" className="w-full px-5 py-3 rounded-xl border" />
            <input name="year" placeholder="Año" className="w-full px-5 py-3 rounded-xl border" />
            <input name="previewUrl" placeholder="URL preview" className="w-full px-5 py-3 rounded-xl border" />
            <input name="highResUrl" placeholder="URL alta resolución" className="w-full px-5 py-3 rounded-xl border" />

            <button className="w-full py-4 bg-black text-white rounded-2xl font-bold">
              Publicar
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-4 text-left text-xs">Obra</th>
                <th className="px-8 py-4 text-right text-xs">Precio</th>
                <th className="px-8 py-4 text-right text-xs">Acción</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((art) => (
                <tr key={art.id} className="border-b">
                  <td className="px-8 py-6 font-bold">{art.title}</td>
                  <td className="px-8 py-6 text-right">${art.price}</td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() =>
                        setArtworks((prev) =>
                          prev.filter((a) => a.id !== art.id)
                        )
                      }
                      className="text-red-500 text-xs font-bold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
