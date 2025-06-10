"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface WaitlistEntry {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function WaitlistAdmin() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/waitlist");
        if (!response.ok) {
          throw new Error("Failed to fetch waitlist data");
        }
        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        setError("Error loading waitlist data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Waitlist Entries</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <>
          <p className="mb-4">Total entries: {entries.length}</p>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Surname</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-3">{entry.name}</td>
                    <td className="p-3">{entry.surname}</td>
                    <td className="p-3">{entry.email}</td>
                    <td className="p-3">{entry.phone}</td>
                    <td className="p-3">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}