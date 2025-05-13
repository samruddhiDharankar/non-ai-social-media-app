'use client';

import { useEffect, useState } from "react";
import { User } from "../types/user";
import { Link } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [fetchedData, setFetchedData] = useState<User[]>([]);
    const [filteredItems, setFilteredItems] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const token = localStorage.getItem("accessToken");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsSearching(true);
    }

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredItems([]);
            setIsSearching(false);
            return;
        }
        const filteredData = fetchedData.filter(user => {
            const query = searchQuery.toLowerCase();
            return (
                user.username.toLowerCase().includes(query) ||
                user.name?.toLowerCase().includes(query)
            );
        });
        setFilteredItems(filteredData);

        setIsSearching(true);

    }, [fetchedData, searchQuery]);


    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${VITE_API_URL}/users/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
                // credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                setFetchedData(data);
            }
        }
        fetchUsers();
    }, [])

    return (
        <div className="w-90 px-4 sm:px-6 md:px-8">
            <div className="relative mx-auto w-full max-w-sm">
                <input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full border border-pink-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />



                {isSearching && filteredItems.length > 0 && (

                    <ul className="absolute z-10 mt-1 w-full navbar-background rounded shadow-lg max-h-60 overflow-auto">
                        {filteredItems.map((item, index) => (
                            <li
                                key={index}
                                // className="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilteredItems([]);
                                    setIsSearching(false);
                                }}
                            >
                                <Link to={`/${item.username}`} className="flex flex-col px-4 py-3 hover:bg-gray-50 transition-all duration-150">
                                    <span className="primary-text text-sm font-semibold truncate">{item.name}</span>
                                    <span className="secondary-text text-xs truncate">{item.username}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}


            </div>
        </div>
    )
}

export default SearchBar
