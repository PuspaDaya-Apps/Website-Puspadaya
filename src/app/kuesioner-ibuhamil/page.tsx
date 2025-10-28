import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import EPDSQuestionnaire from "@/components/kuesioner-ibuhamil/EPDSQuestionnaire";

export const metadata: Metadata = {
    title: "Puspadaya - Kuisioner Ibu Hamil",
    description: "Halaman kuisioner untuk ibu hamil",
};

const Kuisioner = () => {
    return (
        <DefaultLayout>
            <div className="mx-auto w-full ">
                <Breadcrumb pageName="Kuisioner" />
                {/* Kuisioner EPDS Component */}
                <EPDSQuestionnaire />
            </div>
        </DefaultLayout>
    );
};

export default Kuisioner;
