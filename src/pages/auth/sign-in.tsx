import { useAuthStore } from "@/components/store/authStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/supabaseClient";

const formSchema = z.object({
  email: z.email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(4, {
    message: "비밀번호는 최소 4자 이상입니다.",
  }),
});

function SignIn() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: error.message,
      });
    } else if (data.user && data.session) {
      const userId = data.user.id;

      // 🔍 userinfo 테이블에서 추가 정보 가져오기
      const { data: userInfo, error: userInfoError } = await supabase
        .from("userinfo")
        .select("*")
        .eq("id", userId)
        .single();

      if (userInfoError) {
        Swal.fire({
          icon: "error",
          title: "사용자 정보 조회 실패",
          text: userInfoError.message,
        });
        return;
      }

      // 상태 저장
      const fullUserData = {
        id: userId,
        email: data.user.email!,
        username: userInfo.username,
        gender: userInfo.gender,
        birthdate: userInfo.birthdate,
      };

      setUser(fullUserData);
      sessionStorage.setItem("supabase_session", JSON.stringify(fullUserData));

      Swal.fire({
        icon: "success",
        title: "로그인 성공!",
      }).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <Card className="w-full min-w-[400px] min-h-[400px] justify-between border-0 sm:border bg-transparent sm:bg-card">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle className="text-lg">로그인</CardTitle>
        <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-0 sm:px-6">
        {/* 로그인 폼 */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col  gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일을 입력하세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>비밀번호</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex flex-col  mt-10 gap-3">
              <Button type="submit" className="cursor-pointer">
                로그인
              </Button>
              <div className="text-sm text-center">
                계정이 없으신가요?
                <Link to={"/sign-up"} className="underline ml-1">
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SignIn;
