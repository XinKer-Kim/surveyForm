import { supabase } from "@/supabaseClient";
const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
        form.setError("confirmPassword", {
            message: "비밀번호가 일치하지 않습니다.",
        });
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        alert(`회원가입 실패: ${error.message}`);
    } else {
        alert("회원가입 성공! 이메일 인증을 확인하세요.");
        // 리디렉션 또는 추가 처리
    }
};

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CalendarHook } from "@/components/form/CalendarHook";

const formSchema = z.object({
  email: z.email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(8, {
    message: "비밀번호는 최소 8자 이상입니다.",
  }),
  confirmPassword: z.string().min(8, {
    message: "비밀번호를 확인 후 입력해주세요.",
  }),
});


function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("제출됨:", values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-sm mx-auto mt-10"
      >
        <FormField
          control={form.control}
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
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type="confirmPassword"
                  placeholder="비밀번호 확인란을 입력하세요."
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-xs font-normal" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">남자</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">여자</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">밝히고 싶지 않음</Label>
          </div>
        </div>
        <CalendarHook />

        <Button type="submit" className="w-full">
          가입하기
        </Button>
      </form>
    </Form>
  );
}
export default SignUp;

