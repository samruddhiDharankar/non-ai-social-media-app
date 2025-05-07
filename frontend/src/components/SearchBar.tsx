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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setIsSearching(true);
    }

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredItems([]);
            setIsSearching(false);
            return;
        }
        const filteredData = fetchedData.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems(filteredData);
        console.log(filteredItems);
        setIsSearching(true);

    }, [fetchedData, searchQuery]);


    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${VITE_API_URL}/users/`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            console.log("fetched data ", data);
            if (response.ok) {
                setFetchedData(data);
            }
        }
        fetchUsers();
    }, [])

    return (
        <div className="relative w-64">
            <input
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full border border-gray-300 rounded px-3 py-2"
            />



            {isSearching && filteredItems.length > 0 && (

                <ul className="absolute z-10 mt-1 w-full bg-white rounded shadow-lg max-h-60 overflow-auto">
                    {filteredItems.map((item, index) => (
                        <li
                            key={index}
                            className="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                            onClick={() => {
                                setSearchQuery("");
                                setFilteredItems([]);
                                setIsSearching(false);
                            }}
                        >
                            <Link to={`/${item.username}`}>
                                <p className="font-medium text-purple-500">{item.username}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}



        </div>
    )
}

export default SearchBar
