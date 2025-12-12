import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// --------------------
// Board-Level Stats
export default function StatsBoard() {
  return (
    <div className="grid md:grid-cols-2 gap-6 py-4">
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg">Board Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">Kilter Board 2024</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg">Climbs on Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">128</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 flex items-center justify-center text-muted-foreground">
            {/* placeholder for chart */}
            <span>Chart goes here</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


// ---------------------------
  // Extract unique boards from sessions
  // ---------------------------
  // const boards = useMemo(() => {
  //   const all = sessions.map((s) => s.board || "Unknown");
  //   return Array.from(new Set(all));
  // }, [sessions]);
    // ---------------------------
  // Filter sessions based on board selection
  // ---------------------------
  // const filteredSessions = useMemo(() => {
  //   if (selectedBoards.length === 0) return [];
  //   return sessions.filter((s) => selectedBoards.includes(s.board));
  // }, [sessions, selectedBoards]);

  // // ---------------------------
  // // Handle board multi-select
  // // ---------------------------
  // const handleBoardSelect = (e) => {
  //   const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
  //   setSelectedBoards(values);
  //   setSelectedSession(""); // reset
  // };

// {/* ====================================================== */}
        // {/*                 BOARD MULTI SELECT                     */}
        // {/* ====================================================== */}
        // {/* <div className="flex flex-col gap-2">
        //   <label
        //     htmlFor="boardSelect"
        //     className="text-white font-semibold flex justify-between"
        //   >
        //     Select Board(s)
        //     <span className="text-xs text-stone-500">
        //       (Cmd/Ctrl-click to multi-select)
        //     </span>
        //   </label>

        //   <select
        //     id="boardSelect"
        //     multiple
        //     className="p-2 h-32 rounded bg-stone-800 text-white"
        //     value={selectedBoards}
        //     onChange={handleBoardSelect}
        //   >
        //     {boards.map((b) => (
        //       <option key={b} value={b}>
        //         {b}
        //       </option>
        //     ))}
        //   </select>
        // </div> */}

        // {/* ====================================================== */}
        // {/*                   SESSION SELECT                       */}
        // {/* ====================================================== */}
        // <div className="flex flex-col gap-2">
        //   <label htmlFor="sessionSelect" className="text-white font-semibold">
        //     Select Session
        //   </label>

        //   <select
        //     id="sessionSelect"
        //     className="p-2 rounded bg-stone-800 text-white disabled:bg-stone-700"
        //     value={selectedSession || ""}
        //     disabled={sessions.length === 0}
        //     onChange={(e) => setSelectedSession(e.target.value)}
        //   >
        //     <option value="">-- Select Session --</option>

        //     {sessions.map((s) => (
        //       <option key={s.id} value={s.id}>
        //         {s.board} — {new Date(s.date).toLocaleDateString()}
        //       </option>
        //     ))}
        //   </select>
        // </div>

                {/* ====================================================== */}
        {/*                       DASHBOARD                        */}
        {/* ====================================================== */}
        // {selectedSession && token && (
        //   <Dashboard sessionId={selectedSession} token={token} />
        // )}

