import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DevLockOverlay from "@/components/DevLockOverlay";
import { ArrowUp, BarChart2, MessageSquare, User, DollarSign, PercentIcon, ShoppingCart, Lock } from "lucide-react";
import Layout from "@/components/Layout";

export function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1 - Total de usuários */}
          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Total de Usuários</CardTitle>
              <User className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-sm text-gray-400">Usuários registrados</p>
              <DevLockOverlay className="!rounded-b-lg !rounded-t-none" />
            </CardContent>
          </Card>
          
          {/* Card 2 - Mensagens */}
          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Mensagens</CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-sm text-gray-400">Nos últimos 30 dias</p>
              <DevLockOverlay className="!rounded-b-lg !rounded-t-none" />
            </CardContent>
          </Card>
          
          {/* Card 3 - Desempenho de Agentes */}
          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Desempenho de Agentes</CardTitle>
              <BarChart2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-sm text-gray-400">Conversas com sucesso</p>
              <DevLockOverlay className="!rounded-b-lg !rounded-t-none" />
            </CardContent>
          </Card>
          
          {/* Card 4 - Desempenho de Tráfego */}
          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Desempenho de Tráfego</CardTitle>
              <ArrowUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">0%</div>
              <p className="text-sm text-gray-400">Taxa de crescimento</p>
              <DevLockOverlay className="!rounded-b-lg !rounded-t-none" />
            </CardContent>
          </Card>
        </div>

        {/* Gráfico principal - lucro e receita */}
        <div className="relative bg-dark-700 border-zinc-800 rounded-lg p-6 mb-6 overflow-hidden">
          <h2 className="text-xl font-semibold text-white mb-3">Lucro Líquido</h2>
          <div className="text-3xl font-bold text-primary mb-2">R$ 720,80</div>
          <p className="text-sm text-green-500">+ 0.00% a mais neste período</p>
          
          {/* Conteúdo do gráfico */}
          <div className="h-40 mt-4">
            {/* Área do gráfico */}
          </div>
          
          {/* Cards laterais */}
          <div className="absolute top-6 right-6 space-y-4" style={{zIndex: 5}}>
            <Card className="bg-dark-700 border-zinc-800 w-64">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Receita Líquida</p>
                    <div className="text-xl font-bold text-white">R$ 0,00</div>
                  </div>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-green-500">+ 0.00% a mais</p>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-700 border-zinc-800 w-64">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Marketing</p>
                    <div className="text-xl font-bold text-white">R$ 219,84</div>
                  </div>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-green-500">+ 0.00% a mais</p>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-700 border-zinc-800 w-64">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">ROI</p>
                    <div className="text-xl font-bold text-white">0%</div>
                  </div>
                  <PercentIcon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-green-500">+ 0.00% a mais</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center" style={{zIndex: 9999}}>
            <div className="text-center space-y-3">
              <Lock className="h-14 w-14 text-primary mx-auto drop-shadow-lg" />
              <p className="text-white font-medium px-4">
                Em desenvolvimento
              </p>
            </div>
          </div>
        </div>

        {/* Desempenho do Agente */}
        <div className="relative bg-dark-700 border-zinc-800 rounded-lg p-6 mb-6 overflow-hidden">
          <h2 className="text-xl font-semibold text-white mb-6">Desempenho do Agente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-dark-800 border-zinc-700">
              <CardContent className="p-4 flex items-center">
                <div className="rounded-full bg-teal-900/30 p-3 mr-4">
                  <MessageSquare className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Mensagens</p>
                  <div className="text-2xl font-bold text-white">120</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-800 border-zinc-700">
              <CardContent className="p-4 flex items-center">
                <div className="rounded-full bg-teal-900/30 p-3 mr-4">
                  <ShoppingCart className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Vendas</p>
                  <div className="text-2xl font-bold text-white">35</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-800 border-zinc-700">
              <CardContent className="p-4 flex items-center">
                <div className="rounded-full bg-teal-900/30 p-3 mr-4">
                  <PercentIcon className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Taxa de Conversão</p>
                  <div className="text-2xl font-bold text-white">29.17%</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center" style={{zIndex: 9999}}>
            <div className="text-center space-y-3">
              <Lock className="h-14 w-14 text-primary mx-auto drop-shadow-lg" />
              <p className="text-white font-medium px-4">
                Em desenvolvimento
              </p>
            </div>
          </div>
        </div>
        
        {/* Desempenho do Tráfego */}
        <div className="relative bg-dark-700 border-zinc-800 rounded-lg p-6 overflow-hidden">
          <h2 className="text-xl font-semibold text-white mb-6">Desempenho do Tráfego</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-dark-800 border-zinc-700">
              <CardContent className="p-4 flex items-center">
                <div className="rounded-full bg-teal-900/30 p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Custo por Conversa</p>
                  <div className="text-2xl font-bold text-white">R$ 0.88</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-800 border-zinc-700">
              <CardContent className="p-4 flex items-center">
                <div className="rounded-full bg-teal-900/30 p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Custo por Aquisição</p>
                  <div className="text-2xl font-bold text-white">R$ 5.52</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-800 border-zinc-700">
              <CardContent className="p-4 flex items-center">
                <div className="rounded-full bg-teal-900/30 p-3 mr-4">
                  <PercentIcon className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">ROI da Campanha</p>
                  <div className="text-2xl font-bold text-white">0.63%</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center" style={{zIndex: 9999}}>
            <div className="text-center space-y-3">
              <Lock className="h-14 w-14 text-primary mx-auto drop-shadow-lg" />
              <p className="text-white font-medium px-4">
                Em desenvolvimento
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 