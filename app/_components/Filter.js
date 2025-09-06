"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filterItems = [
  { name: "All cabins", value: "all" },
  { name: "1\u20143 guests", value: "small" },
  { name: "4\u20147 guests", value: "medium" },
  { name: "8\u201412 guests", value: "large" },
];

function Filter() {
  // 1. get the searchParams (Ex: capacity=small)
  const searchParams = useSearchParams();
  const router = useRouter();
  // 2. get pathname
  const pathname = usePathname();

  function handleFilter(filter) {
    //3.1 clone the searchParams with into mutable one --allow--> .set(), .append(), .delete()
    const params = new URLSearchParams(searchParams);
    //3.2 set new value
    params.set("capacity", filter);
    //4. change URL to new one
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currentFilter = searchParams.get("capacity") || "all";

  return (
    <div className="border border-primary-800 flex">
      {filterItems.map((filter) => (
        <button
          className={`px-5 py-2 hover:bg-primary-700 ${
            currentFilter === filter.value ? "bg-primary-700" : "cursor-pointer"
          }`}
          disabled={currentFilter === filter.value}
          key={filter.name}
          onClick={() => handleFilter(filter.value)}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
}

export default Filter;
