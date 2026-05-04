import { useEffect, useState } from "react";

export default function App() {
  const [name, setname] = useState("");
  const [file, setfile] = useState(null);
  const [parentid, setparentid] = useState(null);
  const [data, setdata] = useState([]);
  const [editid, seteditid] = useState(null);
  const [search, setsearch] = useState("");

  const getdata = async () => {
    let url = `http://localhost:1212/api/v2/getfile`;
    if (parentid) {
      url = `http://localhost:1212/api/v2/getfile/${parentid}`;
    }
    const res = await fetch(url);
    const result = await res.json();
    setdata(result);
  };

  useEffect(() => {
    getdata();
  }, [parentid]);

  const addtask = async (e) => {
    e.preventDefault();

    if (editid) {
      await fetch(`http://localhost:1212/api/v2/updatefile/${editid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      seteditid(null);
      setname("");
      getdata();
      return;
    }

    const formdata = new FormData();
    formdata.append("name", name);

    if (file) formdata.append("file", file);
    if (parentid) formdata.append("parentid", parentid);

    await fetch(`http://localhost:1212/api/v2/createfile`, {
      method: "POST",
      body: formdata,
    });

    setname("");
    setfile(null);
    getdata();
  };

  const deletes = async (id) => {
    await fetch(`http://localhost:1212/api/v2/deletefile/${id}`, {
      method: "DELETE",
    });
    getdata();
  };

  const openFolder = (item) => {
    if (item.type === "folder") setparentid(item._id);
  };

  const editItem = (item) => {
    setname(item.name);
    seteditid(item._id);
  };

  const isImage = (file) => {
    return file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-[#0f0c14] text-white min-h-screen">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/40 to-black"></div>

        <h1 className="absolute text-[15vw] opacity-[0.04] top-1/3 left-1/4">
          SHIYAN
        </h1>
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 w-full flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-start md:items-center px-4 md:px-6 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
          Shiyan Drive
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search files..."
          className="w-full md:w-64 bg-white/10 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* FORM */}
        <form
          onSubmit={addtask}
          className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto"
        >
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="File name..."
            className="flex-1 min-w-[120px] bg-white/10 px-3 py-2 rounded-lg outline-nonerounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="file"
            id="fileUpload"
            onChange={(e) => setfile(e.target.files[0])}
            className="hidden"
          />

          <label
            htmlFor="fileUpload"
            className="px-3 py-2 bg-white/10 rounded-lg cursor-grab hover:bg-white/20"
          >
            📁 File
          </label>

          <button className="bg-gradient-to-r from-violet-600 cursor-pointer to-blue-600 px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition">
            {editid ? "Update" : "Upload"}
          </button>
        </form>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 h-full w-60 pt-20 bg-black/40 backdrop-blur-xl border-r border-white/10 hidden md:block">
        <div className="p-4 space-y-2">
          <button
            onClick={() => setparentid(null)}
            className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg"
          >
            My Drive
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="md:ml-60 pt-28 md:pt-24 p-4 md:p-6">
        {parentid && (
          <button
            onClick={() => setparentid(null)}
            className="mb-4 bg-red-500 px-3 py-1 rounded"
          >
            ← Back
          </button>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 p-3 md:p-4 rounded-2xl backdrop-blur-xl hover:scale-105 transition border border-white/10 hover:border-violet-500/50"
            >
              <div
                onClick={() => openFolder(item)}
                className="cursor-pointer h-28 md:h-40 rounded-xl overflow-hidden bg-black/30 flex items-center justify-center"
              >
                {item.type === "folder" ? (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png"
                    className="w-16 md:w-20"
                  />
                ) : item.file && isImage(item.file) ? (
                  <img src={item.file} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                    className="w-12 md:w-16"
                  />
                )}
              </div>

              <h2 className="mt-2 md:mt-3 text-xs md:text-sm font-semibold truncate">
                {item.name}
              </h2>

              <div className="flex gap-2 md:gap-3 mt-2 md:mt-3 text-[10px] md:text-xs">
                {item.file && (
                  <a href={item.file} target="_blank" className="text-blue-400">
                    Open
                  </a>
                )}
                <button
                  onClick={() => editItem(item)}
                  className="text-yellow-400 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletes(item._id)}
                  className="text-red-400 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {filteredData.length === 0 && (
          <div className="text-center mt-20 opacity-60">
            <h2>No matching files</h2>
          </div>
        )}
      </main>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 w-full bg-black/60 backdrop-blur-xl flex justify-around py-3 md:hidden">
        <button onClick={() => setparentid(null)}>🏠</button>
        <button>⭐</button>
        <button>🗑</button>
      </div>
    </div>
  );
}
