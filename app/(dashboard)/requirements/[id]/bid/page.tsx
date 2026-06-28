"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { apiFetch } from "@/lib/api";

export default function BidPage() {

    const router = useRouter();

    const params = useParams();

    const requirementId = params.id as string;

    const [quotedPrice, setQuotedPrice] = useState("");

    const [quantity, setQuantity] = useState("");

    const [deliveryDays, setDeliveryDays] = useState("");

    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async () => {

        try {

            setLoading(true);

            setError("");

            await apiFetch(

                `/api/requirements/${requirementId}/bids`,

                {

                    method: "POST",

                    body: JSON.stringify({

                        quotedPrice: Number(quotedPrice),

                        quantity: Number(quantity),

                        deliveryDays: Number(deliveryDays),

                        remarks

                    })

                }

            );

            alert("Bid submitted successfully.");

            router.push(`/requirements/${requirementId}`);

        }

        catch (err: any) {

            setError(err.message || "Failed to submit bid.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-2xl mx-auto p-6">

            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-6"
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <Card className="p-8 space-y-6">

                <div>

                    <h1 className="text-2xl font-bold">
                        Raise Bid
                    </h1>

                    <p className="text-sm text-slate-600 mt-1">
                        Submit your quotation for this requirement.
                    </p>

                </div>

                {error && (

                    <div className="rounded-md bg-red-100 text-red-700 p-3">

                        {error}

                    </div>

                )}

                <div className="space-y-2">

                    <Label>

                        Quoted Price (₹)

                    </Label>

                    <Input

                        type="number"

                        value={quotedPrice}

                        onChange={(e) =>
                            setQuotedPrice(e.target.value)
                        }

                        placeholder="Enter quotation"

                    />

                </div>

                <div className="space-y-2">

                    <Label>

                        Quantity

                    </Label>

                    <Input

                        type="number"

                        value={quantity}

                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }

                        placeholder="Enter quantity"

                    />

                </div>

                <div className="space-y-2">

                    <Label>

                        Delivery Days

                    </Label>

                    <Input

                        type="number"

                        value={deliveryDays}

                        onChange={(e) =>
                            setDeliveryDays(e.target.value)
                        }

                        placeholder="Example: 7"

                    />

                </div>

                <div className="space-y-2">

                    <Label>

                        Remarks

                    </Label>

                    <textarea

                        value={remarks}

                        onChange={(e) =>
                            setRemarks(e.target.value)
                        }

                        rows={5}

                        className="w-full rounded-md border border-gray-300 p-3"

                        placeholder="Additional information for buyer..."

                    />

                </div>

                <Button

                    className="w-full"

                    disabled={loading}

                    onClick={handleSubmit}

                >

                    {loading ? (

                        <>

                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                            Submitting...

                        </>

                    ) : (

                        "Submit Bid"

                    )}

                </Button>

            </Card>

        </div>

    );

}