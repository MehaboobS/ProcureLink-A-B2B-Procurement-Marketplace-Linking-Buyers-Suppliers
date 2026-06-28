"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Gavel, CalendarDays, ArrowRight } from "lucide-react";

import { apiFetch } from "@/lib/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RequirementBidSummary {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  quantity: number;
  unit: string;
  closingDatetime: string;
  status: string;
  totalBids: number;
}

export default function BuyerBidsPage() {

  const router = useRouter();

  const [requirements, setRequirements] = useState<RequirementBidSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchRequirements = async () => {

      try {

        const data = await apiFetch("/api/bids");

        setRequirements(data);

      } catch (err: any) {

        setError(err.message || "Unable to load bids.");

      } finally {

        setLoading(false);

      }

    };

    fetchRequirements();

  }, []);

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />

      </div>

    );

  }

  if (error) {

    return (

      <div className="max-w-6xl mx-auto p-8">

        <Card className="p-8 text-center">

          <h2 className="text-red-600 font-semibold">

            {error}

          </h2>

        </Card>

      </div>

    );

  }

  return (

    <div className="max-w-6xl mx-auto p-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          My Requirement Bids

        </h1>

        <p className="text-slate-600 mt-2">

          Review all supplier quotations received for your requirements.

        </p>

      </div>

      {requirements.length === 0 ? (

        <Card className="p-10 text-center">

          <Gavel className="mx-auto h-10 w-10 text-slate-400 mb-4" />

          <h2 className="text-lg font-semibold">

            No Bids Received Yet

          </h2>

          <p className="text-slate-600 mt-2">

            None of your requirements have received bids yet.

          </p>

        </Card>

      ) : (

        <div className="grid gap-6">

          {requirements.map((requirement) => (

            <Card
              key={requirement.id}
              className="p-6 hover:shadow-lg transition cursor-pointer"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-semibold">

                    {requirement.title}

                  </h2>

                  <p className="text-slate-600 mt-1">

                    {requirement.category.name}

                  </p>

                  <p className="mt-3">

                    Quantity:

                    <span className="font-semibold ml-2">

                      {requirement.quantity} {requirement.unit}

                    </span>

                  </p>

                  <div className="flex items-center gap-2 mt-3">

                    <CalendarDays className="h-4 w-4 text-slate-500" />

                    <span>

                      Closing:

                      {" "}

                      {new Date(
                        requirement.closingDatetime
                      ).toLocaleDateString()}

                    </span>

                  </div>

                </div>

                <div className="text-right">

                  <Badge className="mb-3">

                    {requirement.totalBids} Bids

                  </Badge>

                  <br />

                  <Button
                    onClick={() =>
                      router.push(
                        `/requirements/${requirement.id}/bids`
                      )
                    }
                  >

                    View Bids

                    <ArrowRight className="ml-2 h-4 w-4" />

                  </Button>

                </div>

              </div>

            </Card>

          ))}

        </div>

      )}

    </div>

  );

}