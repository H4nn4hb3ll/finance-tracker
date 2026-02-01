import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Chart({chartData}){

    return(
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data = {chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#4ade80" />
                <Bar dataKey="expenses" fill="#7747d1" />
            </BarChart>
        </ResponsiveContainer>
    )

}