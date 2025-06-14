import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Heart, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Haqqımızda</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Zermy - təbiətlə bağlılığınızı artıran, davamlı və eko-dostu məhsullarla 
            yaşıl həyatınızı dəstəkləyən platformadır.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Missiyamız
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                İnsanların təbiətlə daha yaxın əlaqə qurmasına kömək etmək, 
                davamlı həyat tərzini təşviq etmək və gələcək nəsillər üçün 
                daha yaşıl bir dünya yaratmaq.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Vizyonumuz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Azərbaycanda eko-dostu məhsulların ən böyük və etibarlı 
                platforması olmaq, həmçinin AR texnologiyası ilə alış-veriş 
                təcrübəsində yenilik yaratmaq.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Dəyərlərimiz</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Davamlılıq
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ətraf mühitə hörmət edən, təkrar istifadə olunan və 
                  uzunmüddətli məhsullar təqdim edirik.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Cəmiyyət
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yerli istehsalçıları dəstəkləyir və cəmiyyətin 
                  ekoloji şüurunun artmasına töhfə veririk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Yenilik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AR texnologiyası və digər yeniliklərlə alış-veriş 
                  təcrübənizi daha maraqlı edirik.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Hekayəmiz</h2>
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-muted-foreground">
              Zermy 2025-ci ildə yaşıl həyat tərzini təşviq etmək məqsədi ilə yaradıldı. 
              Təsis edildiyi gündən etibarən platformamız min-lərlə müştəriyə xidmət göstərib 
              və onların həyatına yaşıllıq gətirib.
            </p>
            <p className="text-muted-foreground">
              Biz sadəcə məhsul satmırıq - həyat tərzini dəyişirik. Hər bir məhsulumuz 
              diqqətlə seçilir və ətraf mühitə təsiri minimum olan materiallardan hazırlanır.
            </p>
            <p className="text-muted-foreground">
              AR texnologiyası ilə məhsullarımızı evinizə virtual olaraq yerləşdirə bilər, 
              bu da alış-veriş təcrübənizi daha da maraqlı edir.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Bizimlə əlaqə</h3>
          <p className="text-muted-foreground">
            Suallarınız və ya təklifləriniz varsa, bizimlə əlaqə saxlayın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <span>Email: info@zermy.az</span>
            <span>Tel: +994 XX XXX XX XX</span>
            <span>Ünvan: Bakı, Azərbaycan</span>
          </div>
        </div>
      </div>
    </div>
  )
}
