import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import EPDSQuestionnaire from "@/components/kuisioner-ibuhamil/EPDSQuestionnaire";

export const metadata: Metadata = {
    title: "Puspadaya - Kuisioner Ibu Hamil",
    description: "Halaman kuisioner untuk ibu hamil",
};

const Kuisioner = () => {
    return (
        <DefaultLayout>
            <div className="mx-auto w-full max-w-[970px]">
                <Breadcrumb pageName="Kuisioner" />
                {/* Kuisioner EPDS Component */}
                <EPDSQuestionnaire />
            </div>
        </DefaultLayout>
    );
};

export default Kuisioner;
