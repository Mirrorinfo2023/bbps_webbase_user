import React from "react";
import ApiDocumentation from "../components/ApiDocumentation/api-documentation";
import DashboardLayout from "../components/Dashboard/layout";
import withAuth from "../../utils/withAuth";

const ApiDocumentationPage = () => {
    return (
        <DashboardLayout>
            <ApiDocumentation />
        </DashboardLayout>
    );
}

export default withAuth(ApiDocumentationPage);