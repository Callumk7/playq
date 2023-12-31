"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/collection/search?q=${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-2 flex flex-row items-center gap-3">
      <Input
        value={searchTerm}
        name="q"
        placeholder="search for a game"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant={"outline"} size={"sm"}>
        Search
      </Button>
    </form>
  );
}
