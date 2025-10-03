import React from "react";
import IncomePassbook from "../components/incomepassbook/income-passbook";
import DashboardLayout from "../components/Dashboard/layout";
import withAuth from "../../utils/withAuth";

const IncomePassbookPage = () => {
    return (
        <DashboardLayout>
            <IncomePassbook />
        </DashboardLayout>
    );
}

export default withAuth(IncomePassbookPage);