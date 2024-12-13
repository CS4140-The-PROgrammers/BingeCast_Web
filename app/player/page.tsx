"use client";

import 'flowbite/dist/flowbite.css';
import { Button } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaDownload, FaHome, FaStepForward, FaStepBackward } from "react-icons/fa";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Header from '../header';
import Footer from '../footer';

const CACHE_NAME = 'audio-cache';

interface Episode {
    title: string | null;
    url: string | null;
}

// Fetch episodes via the API endpoint
async function fetchEpisodes(rssFeedUrl: string): Promise<Episode[]> {
    if (!rssFeedUrl) {
        console.error("RSS feed URL is empty or undefined.");
        return [];
    }

    try {
        const apiUrl = `/api/fetch-rss?url=${encodeURIComponent(rssFeedUrl)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch RSS feed via API. HTTP Status: ${response.status}`);
        }

        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item"));

        if (items.length === 0) {
            console.warn("No episodes found in the RSS feed.");
        }

        return items.reverse().map(item => ({
            title: item.querySelector("title")?.textContent || "Unknown Episode",
            url: item.querySelector("enclosure")?.getAttribute("url") || null,
        }));
    } catch (error) {
        console.error("Error fetching RSS feed via API:", error);
        return [];
    }
}

// Download and cache audio for offline playback
async function downloadAndCacheAudio(url: string): Promise<void> {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.add(url);

        if (typeof window !== 'undefined') {
            const offlineEpisodes = JSON.parse(localStorage.getItem('offlineEpisodes') || '[]');
            localStorage.setItem('offlineEpisodes', JSON.stringify([...offlineEpisodes, url]));
        }
    } catch (error) {
        console.error("Error caching audio:", error);
    }
}

// Retrieve audio URL from the cache or directly
async function getAudioUrl(url: string): Promise<string> {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(url);
        if (response) {
            return URL.createObjectURL(await response.blob());
        }
        return url;
    } catch (error) {
        console.error("Error retrieving audio URL:", error);
        return url;
    }
}

export default function PlayerPage() {
    const searchParams = useSearchParams();
    const rssfeed = searchParams.get("rssfeed");
    const indexParam = searchParams.get("index");
    const initialIndex = indexParam ? parseInt(indexParam, 10) : 0;
    const router = useRouter();

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(initialIndex);
    const [audioURL, setAudioURL] = useState<string | null>(null);

    // Load episodes when RSS feed changes
    useEffect(() => {
        async function loadEpisodes() {
            if (!rssfeed) return;

            try {
                const episodeList = await fetchEpisodes(rssfeed);
                setEpisodes(episodeList);

                // Set the initial episode to play
                const validIndex = Math.min(initialIndex, episodeList.length - 1);
                setCurrentEpisodeIndex(validIndex);
                setAudioURL(await getAudioUrl(episodeList[validIndex]?.url || ""));
            } catch (error) {
                alert("Failed to load episodes. Please check the RSS feed URL.");
                console.error("Error fetching episodes:", error);
            }
        }
        loadEpisodes();
    }, [rssfeed]);

    // Update audio URL when the current episode changes
    useEffect(() => {
        if (episodes.length > 0 && episodes[currentEpisodeIndex]?.url) {
            (async () => {
                const url = await getAudioUrl(episodes[currentEpisodeIndex].url || "");
                setAudioURL(url);
            })();
        }
    }, [currentEpisodeIndex, episodes]);

    const handleDownload = async () => {
        const currentEpisode = episodes[currentEpisodeIndex];
        if (currentEpisode?.url) {
            try {
                await downloadAndCacheAudio(currentEpisode.url);
                alert(`"${currentEpisode.title}" downloaded for offline playback!`);
            } catch {
                alert("Failed to download the episode.");
            }
        }
    };

    const handleNextEpisode = () => {
        if (currentEpisodeIndex < episodes.length - 1) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    };

    const handlePreviousEpisode = () => {
        if (currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    };

    const handleBackToHome = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Header />
            <main className="p-6 flex justify-center items-center">
                {episodes.length > 0 ? (
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between" style={{ width: '600px', height: '200px' }}>
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-blue-600 mb-4">{episodes[currentEpisodeIndex]?.title}</h2>
                            {audioURL && <AudioPlayer src={audioURL} />}
                        </div>
                        <div className="flex justify-between mt-4">
                            <Button color="primary" onClick={handleBackToHome} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
                                <FaHome className="mr-2" /> Home
                            </Button>
                            <Button color="primary" onClick={handlePreviousEpisode} disabled={currentEpisodeIndex === 0} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
                                <FaStepBackward className="mr-2" /> Previous
                            </Button>
                            <Button color="primary" onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
                                <FaDownload className="mr-2" /> Download
                            </Button>
                            <Button color="primary" onClick={handleNextEpisode} disabled={currentEpisodeIndex === episodes.length - 1} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
                                Next <FaStepForward className="ml-2" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">Loading episodes...</p>
                )}
            </main>
            <Footer />
        </div>
    );
}
