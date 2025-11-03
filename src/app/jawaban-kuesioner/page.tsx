import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import EPDSQuestionnaire from "@/components/kuesioner-ibuhamil/EPDSQuestionnaire";
import DetailJawaban from "@/components/jawaban-kuesioner/DetailJawaban";

export const metadata: Metadata = {
    title: "Puspadaya - Kuisioner Ibu Hamil",
    description: "Halaman kuisioner untuk ibu hamil",
};

const Kuisioner = () => {
    return (
        <DefaultLayout>
            <div className="mx-auto w-full ">
                <Breadcrumb pageName="Jawaban Kuisioner" />

                {/* Detail Jawaban Kuesioner */}
                <DetailJawaban />
            </div>
        </DefaultLayout>
    );
};

export default Kuisioner;
