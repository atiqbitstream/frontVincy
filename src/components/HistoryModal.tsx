// src/components/HistoryModal.tsx

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

// keys we don’t want to treat as the “value” field
const IGNORED = new Set([
  "id",
  "user_email",
  "created_at",
  "created_by",
  "updated_at",
  "updated_by",
]);

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  endpoint: string; // e.g. "/sound", "/led-color", "/temperature-tank"
}

export default function HistoryModal({
  isOpen,
  onClose,
  title,
  endpoint,
}: HistoryModalProps) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");

  // load all entries when modal opens
  useEffect(() => {
    if (!isOpen || !user || !token) return;
    setLoading(true);

    fetch(`${API_URL}/device-controls${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setRecords)
      .catch((e) => console.error("History load failed:", e))
      .finally(() => setLoading(false));
  }, [isOpen, endpoint, user, token]);

  // pick the “value” field dynamically, ignoring created/updated metadata
  const valueField = useMemo(() => {
    if (records.length === 0) return null;
    return Object.keys(records[0]).find((k) => !IGNORED.has(k))!;
  }, [records]);

  // apply date filter
  const filtered = useMemo(() => {
    if (!filterDate || !valueField) return records;
    return records.filter((r) =>
      r.created_at.slice(0, 10) === filterDate
    );
  }, [records, filterDate, valueField]);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogOverlay />

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title} History</DialogTitle>
          <DialogDescription>
            A list of your {title.toLowerCase()} entries.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 my-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filter by date"
          />
          {filterDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDate("")}
            >
              Clear
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div
              className="h-6 w-6 animate-spin rounded-full
                         border-2 border-t-transparent border-gray-300"
            />
          </div>
        ) : filtered.length === 0 || !valueField ? (
          <p className="text-center py-8">No records found.</p>
        ) : (
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">User</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const raw = r[valueField];
                const time = new Date(r.created_at);
                const isBool = typeof raw === "boolean";

                return (
                  <tr key={r.id} className="border-b">
                    <td className="p-2">
                      {isBool ? (
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            raw
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {raw ? "ON" : "OFF"}
                        </span>
                      ) : (
                        <span>{String(raw)}</span>
                      )}
                    </td>
                    <td className="p-2">
                      {time.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      ,{" "}
                      {time.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-2">{r.created_by}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
