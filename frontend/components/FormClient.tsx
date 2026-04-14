"use client";

import { useState } from "react";

export default function FormClient({
  agregar,
  eliminar,
  listaInicial,
}: {
  agregar: (data: FormData) => Promise<any>;
  eliminar: (id: number) => Promise<any>;
  listaInicial: { id: number; nombre: string }[];
}) {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [lista, setLista] = useState(listaInicial);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    await agregar(data);

    setMensaje("✅ Guardado correctamente");

    setLista([{ id: Date.now(), nombre }, ...lista]);

    setNombre("");
  }

  async function handleDelete(id: number) {
    await eliminar(id);

    setLista(lista.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Agregar a lista de deseados
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del ítem"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
          >
            Guardar
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {mensaje}
          </p>
        )}
      </div>
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista</h2>

        {lista.length === 0 ? (
          <p className="text-gray-500 text-center">No hay elementos aún</p>
        ) : (
          <ul className="space-y-2">
            {lista.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
              >
                <span className="text-gray-800">{item.nombre}</span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
