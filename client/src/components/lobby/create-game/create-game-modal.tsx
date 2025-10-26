"use client";

import { CreateGameFormData, createGameFormSchema } from "@/lib/zod-schemas";
import { createGame } from "@/services/game-api";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/components/error/error-message";
import { useSession } from "next-auth/react";
import { useLobbyContext } from "@/contexts/LobbyContext";

export const CreateGameModal = () => {
    const { showModal, setShowModal, setIsJoining } = useLobbyContext();
    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const [isCreatingGame, setIsCreatingGame] = useState(false);
    const [apiError, setApiError] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<CreateGameFormData>({
        resolver: zodResolver(createGameFormSchema),
        defaultValues: {
            gameName: "",
            numPlayers: "2",
            isPrivate: false,
            password: "",
        },
    });

    const watchedNumPlayers = watch("numPlayers");
    const watchedIsPrivate = watch("isPrivate");

    if (!showModal) return null;

    const onSubmit = async (data: CreateGameFormData) => {
        if (!userId) throw new Error("User ID not found");

        try {
            setIsCreatingGame(true);
            setIsJoining(true);
            const response = await createGame({
                userId,
                numPlayers: parseInt(data.numPlayers) as 2 | 4,
                gameName: data.gameName,
                isPrivate: data.isPrivate,
                password: data.isPrivate ? data.password : undefined,
            });
            router.push(`/app/game/${response.id}`);
            closeModal();
          } catch (err) {
            setApiError(
                err instanceof Error ? err.message : "An error occurred"
            );
            setIsJoining(false);
        } finally {
            setIsCreatingGame(false);
        }
    };

    function closeModal() {
        setShowModal(false);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Create New Game
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isCreatingGame}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Game Name Input */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="gameName">Game Name:</Label>
                        <Input
                            id="gameName"
                            type="text"
                            {...register("gameName")}
                            placeholder="Enter game name"
                            disabled={isCreatingGame}
                        />
                        {errors.gameName && (
                            <ErrorMessage
                                message={errors.gameName.message || ""}
                            />
                        )}
                    </div>

                    {/* Number of Players Selection */}
                    <div className="flex flex-col gap-2">
                        <Label>Number of Players:</Label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setValue("numPlayers", "2")}
                                className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-colors duration-200 ${
                                    watchedNumPlayers === "2"
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                                        : "border-gray-300 text-gray-600 hover:border-indigo-400"
                                }`}
                                disabled={isCreatingGame}
                            >
                                2
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("numPlayers", "4")}
                                className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-colors duration-200 ${
                                    watchedNumPlayers === "4"
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                                        : "border-gray-300 text-gray-600 hover:border-indigo-400"
                                }`}
                                disabled={isCreatingGame}
                            >
                                4
                            </button>
                        </div>
                    </div>

                    {/* Private Game Toggle */}
                    <div className="flex flex-col gap-2">
                        <Label>Game Privacy:</Label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setValue("isPrivate", false)}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    !watchedIsPrivate
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                disabled={isCreatingGame}
                            >
                                Public
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("isPrivate", true)}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    watchedIsPrivate
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                disabled={isCreatingGame}
                            >
                                Private
                            </button>
                        </div>
                    </div>

                    {/* Password Input (only shown for private games) */}
                    {watchedIsPrivate === true && (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password:</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder="Enter password"
                                disabled={isCreatingGame}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isCreatingGame || !isValid}
                    >
                        {isCreatingGame ? "Creating Game..." : "Create Game"}
                    </button>
                    {apiError && <ErrorMessage message={apiError} />}
                </form>
            </div>
        </div>
    );
};
