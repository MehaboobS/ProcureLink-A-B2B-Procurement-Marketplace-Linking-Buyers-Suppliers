"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Loader2, ArrowLeft } from "lucide-react";

import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Bid {

  id: string;

  quotedPrice: number;

  quantity: number;

  deliveryDays: number;

  remarks: string | null;

  status: string;

  createdAt: string;

  supplier: {

    id: string;

    email: string;

    supplierProfile: {

      companyName: string;

      location: string;

      supplierType: string;

    };

  };

}

interface Requirement {

  id: string;

  title: string;

  quantity: number;

  unit: string;

}

interface Response {

  requirement: Requirement;

  bids: Bid[];

}

export default function RequirementBidsPage() {

  const router = useRouter();

  const params = useParams();

  const requirementId = params.id as string;

  const [data, setData] = useState<Response | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadBids = async () => {

    try {

      setLoading(true);

      const response = await apiFetch(

        `/api/requirements/${requirementId}/bids`

      );

      setData(response);

    } catch (err: any) {

      setError(err.message || "Unable to load bids.");

    } finally {

      setLoading(false);

    }

  };

  const acceptBid = async (bidId: string) => {

    try {

      await apiFetch(`/api/bids/${bidId}/accept`, {

        method: "PUT",

      });

      alert("Bid accepted successfully.");

      await loadBids();

    } catch (err: any) {

      alert(err.message);

    }

  };

  useEffect(() => {
    loadBids();

  }, [requirementId]);

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />

      </div>

    );

  }

  if (error || !data) {

    return (

      <div className="max-w-5xl mx-auto p-8">

        <Card className="p-8 text-center">

          <h2 className="text-red-600 font-semibold">

            {error || "Unable to load requirement."}

          </h2>

        </Card>

      </div>

    );

  }

  return (

    <div className="max-w-6xl mx-auto p-8">

      <Button

        variant="outline"

        onClick={() => router.back()}

        className="mb-6"

      >

        <ArrowLeft className="mr-2 h-4 w-4" />

        Back

      </Button>

      <Card className="p-6 mb-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">

              {data.requirement.title}

            </h1>

            <p className="text-slate-600 mt-2">

              Quantity Required

              <span className="font-semibold ml-2">

                {data.requirement.quantity} {data.requirement.unit}

              </span>

            </p>

          </div>

          <Badge className="text-base px-4 py-2">

            {data.bids.length} Bid(s)

          </Badge>

        </div>

      </Card>

      {data.bids.length === 0 ? (

        <Card className="p-10 text-center">

          <h2 className="text-lg font-semibold">

            No bids received.

          </h2>

        </Card>

      ) : (

        <div className="space-y-5">

          {data.bids.map((bid) => (

            <Card

              key={bid.id}

              className="p-6"

            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-xl font-semibold">

                    {

                      bid.supplier.supplierProfile.companyName

                    }

                  </h2>

                  <p className="text-slate-500">

                    {bid.supplier.email}

                  </p>

                  <p className="mt-3">

                    Supplier Type :

                    {" "}

                    {bid.supplier.supplierProfile.supplierType}

                  </p>

                  <p>

                    Location :

                    {" "}

                    {bid.supplier.supplierProfile.location}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-lg font-bold">

                    ₹

                    {bid.quotedPrice.toLocaleString()}

                  </p>

                  <p>

                    Quantity :

                    {" "}

                    {bid.quantity}

                  </p>

                  <p>

                    Delivery :

                    {" "}

                    {bid.deliveryDays}

                    {" "}

                    Days

                  </p>

                  <Badge
                    className={`mt-3 ${
                      bid.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : bid.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : bid.status === "SHORTLISTED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >

                    {bid.status}

                  </Badge>

                </div>

              </div>

              {bid.remarks && (

                <div className="mt-5 border-t pt-4">

                  <p className="text-sm text-slate-500">

                    Remarks

                  </p>

                  <p>

                    {bid.remarks}

                  </p>

                </div>

              )}

              {bid.status === "ACCEPTED" && (

                <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">

                  <h3 className="font-semibold text-green-700">

                    🎉 Deal Approved

                  </h3>

                  <p className="text-sm text-green-600 mt-1">

                    This supplier has been selected for this requirement.

                  </p>

                </div>

              )}

              {bid.status === "REJECTED" && (

                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">

                  <h3 className="font-semibold text-red-700">

                    Bid Rejected

                  </h3>

                  <p className="text-sm text-red-600 mt-1">

                    This quotation was not selected by the buyer.

                  </p>

                </div>

              )}

              <div className="mt-6 flex justify-end">

                {bid.status === "PENDING" && (

                  <Button onClick={() => acceptBid(bid.id)}>

                    Accept Bid

                  </Button>

                )}
              </div>

            </Card>

          ))}

        </div>

      )}

    </div>

  );

}