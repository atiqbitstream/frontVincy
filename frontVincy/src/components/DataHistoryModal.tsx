// src/components/DataHistoryModal.tsx

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Edit2, Trash2, Check, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

interface Field {
  name: string;
  label: string;
}

interface DataHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;            // e.g. "Biofeedback"
  endpoint: string;         // e.g. "/biofeedback"
  fields: Field[];          // e.g. [{ name: "heart_rate", label: "Heart Rate (BPM)" }, …]
}

export default function DataHistoryModal({
  isOpen,
  onClose,
  title,
  endpoint,
  fields,
}: DataHistoryModalProps) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});

  // fetch all entries when modal opens
  useEffect(() => {
    if (!isOpen || !user || !token) return;
    setLoading(true);

    fetch(`${API_URL}/health-monitoring${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setRows)
      .catch((err) => console.error("Data history load failed:", err))
      .finally(() => setLoading(false));
  }, [isOpen, endpoint, user, token]);

  // apply date filter
  const filtered = useMemo(() => {
    if (!filterDate) return rows;
    return rows.filter((r) => r.created_at.slice(0, 10) === filterDate);
  }, [rows, filterDate]);

  const startEdit = (row: any) => {
    setEditingId(row.id);
    // copy only the fields we want to edit
    const copy: Record<string, any> = {};
    fields.forEach((f) => {
      copy[f.name] = row[f.name];
    });
    setEditingData(copy);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(
        `${API_URL}/health-monitoring${endpoint}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editingData,
            updated_by: user.email,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Update failed (${res.status})`);
      }
      const updated = await res.json();
      setRows((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
      cancelEdit();
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update entry.");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(
        `${API_URL}/health-monitoring${endpoint}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete entry.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />

        <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto 
                                   bg-white p-6 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <DialogHeader>
            <DialogTitle>{title} History</DialogTitle>
            <DialogDescription>
              All past entries for {title.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-4 mb-6">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
            />
            {filterDate && (
              <Button variant="ghost" size="sm" onClick={() => setFilterDate("")}>
                Clear
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div
                className="h-6 w-6 animate-spin rounded-full
                           border-2 border-t-transparent border-gray-300"
              />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No entries found.</p>
          ) : (
            <div className="space-y-6">
              {filtered.map((r) => {
                const time = new Date(r.created_at);
                const isEditing = r.id === editingId;

                return (
                  <div key={r.id} className="border rounded-lg p-4 shadow-sm">
                    {/* header: user + timestamp + actions */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-medium">{r.created_by}</p>
                        <p className="text-sm text-gray-500">
                          {time.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          {time.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              className="p-1 hover:text-green-600"
                              onClick={() => saveEdit(r.id)}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="p-1 hover:text-gray-600"
                              onClick={cancelEdit}
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="p-1 hover:text-blue-600"
                              onClick={() => startEdit(r)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="p-1 hover:text-red-600"
                              onClick={() => deleteEntry(r.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* field grid or edit form */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {fields.map((f) => (
                        <div key={f.name} className="flex">
                          <span className="font-medium w-40">{f.label}:</span>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editingData[f.name]}
                              onChange={(e) =>
                                setEditingData((prev) => ({
                                  ...prev,
                                  [f.name]: parseFloat(e.target.value),
                                }))
                              }
                              className="w-full"
                            />
                          ) : (
                            <span>{r[f.name]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="mt-6 text-right">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
