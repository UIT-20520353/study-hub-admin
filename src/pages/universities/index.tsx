import { useGetUniversities } from "@/api/universityApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/common/button";
import { ROUTES } from "@/constants/app";

const Universities: React.FunctionComponent = () => {
  const { data: universities } = useGetUniversities();
  const navigate = useNavigate();

  const onViewDetailClick = (id: string | number) => {
    navigate(ROUTES.universityDetail(id));
  };

  return (
    <div className="w-full p-5 bg-white rounded shadow-xs">
      <div className="w-full">
        <div className="max-h-[500px] overflow-y-auto w-full">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên trường</TableHead>
                <TableHead>Tên viết tắt</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thành phố</TableHead>
                <TableHead>Website</TableHead>
                {/* <TableHead>Trạng thái</TableHead> */}
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities?.body &&
                universities.body.map((university) => (
                  <TableRow key={university.id}>
                    <TableCell>{university.id}</TableCell>
                    <TableCell>{university.name}</TableCell>
                    <TableCell>{university.shortName}</TableCell>
                    <TableCell>{university.address}</TableCell>
                    <TableCell>{university.city}</TableCell>
                    <TableCell>
                      <Link
                        className="text-blue-500 underline"
                        to={university.website}
                        target="_blank"
                      >
                        {university.website}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="primary"
                        leftIcon={<Eye className="w-4 h-4 text-white" />}
                        size="sm"
                        onClick={() => onViewDetailClick(university.id)}
                        iconOnly
                      ></Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Universities;
