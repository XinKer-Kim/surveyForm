import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/supabaseClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CalendarHook } from "@/components/form/CalendarHook";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "이름은 최소 2자 이상입니다.",
    }),
    email: z.email({
      message: "올바른 형식의 이메일 주소를 입력해주세요.",
    }),
    password: z.string().min(8, {
      message: "비밀번호는 최소 8자 이상입니다.",
    }),

    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "undefined"]),
    birthdate: z
      .date()
      .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
        message: "생년월일을 선택해주세요.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

function SignUp() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "male",
      birthdate: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, username, gender, birthdate } = values;

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (signUpError) throw signUpError;

      // authUser가 존재하면 추가 정보 저장
      const userId = authData.user?.id;
      if (userId) {
        const { error: insertError } = await supabase.from("userinfo").insert({
          id: userId,
          username,
          gender,
          birthdate: birthdate,
        });

        if (insertError) throw insertError;
      }

      Swal.fire({
        icon: "success",
        title: "회원가입 성공!",
      });
      navigate("/sign-in");
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "회원가입 실패",
        text: error.message || "문제가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <Card className="w-full min-w-[400px] min-h-[400px] justify-between ">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle className="text-lg">회원가입</CardTitle>
        <CardDescription>회원가입을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-sm mx-auto mt-10"
          >
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="이름을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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

            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type="Password"
                      placeholder="비밀번호 확인란을 입력하세요."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성별</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex  space-x-2"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="male" id="gender-male" />
                        </FormControl>
                        <Label htmlFor="gender-male">남자</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="female" id="gender-female" />
                        </FormControl>
                        <Label htmlFor="gender-female">여자</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem
                            value="undefined"
                            id="gender-undefined"
                          />
                        </FormControl>
                        <Label htmlFor="gender-undefined">비공개</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>생년월일을 선택해주세요.</FormLabel>
                  <FormControl>
                    <CalendarHook
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              가입하기
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
export default SignUp;
