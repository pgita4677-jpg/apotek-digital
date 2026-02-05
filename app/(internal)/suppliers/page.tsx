export default function SupplierPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data Supplier</h1>

      <div className="mb-4">
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg">
          + Tambah Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nama Supplier</th>
              <th className="p-3">No. Telepon</th>
              <th className="p-3">Alamat</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">PT Sehat Selalu</td>
              <td className="p-3">08123456789</td>
              <td className="p-3">Jl. Kesehatan No.10</td>
              <td className="p-3 space-x-2">
                <button className="text-sky-600">Edit</button>
                <button className="text-red-500">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
